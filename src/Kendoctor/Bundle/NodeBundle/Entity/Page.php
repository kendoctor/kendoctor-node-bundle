<?php

namespace Kendoctor\Bundle\NodeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Page
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Kendoctor\Bundle\NodeBundle\Entity\PageRepository")
 */
class Page
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     *
     * @var type 
     * @Gedmo\Slug(fields={"title"})
     * @ORM\Column(name="slug", type="string", length=100)
     */
    private $slug;
    
    /**
     * @var string
     *
     * @ORM\Column(name="body", type="text")
     */
    private $body;
    
    
    /**
     *
     * @var type 
     * 
     * @ORM\ManyToOne(targetEntity="PageCategory", inversedBy="pages")
     * @ORM\JoinColumn(name="category_id", referencedColumnName="id")
     */
    private $category;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return Page
     */
    public function setTitle($title)
    {
        $this->title = $title;
    
        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set body
     *
     * @param string $body
     * @return Page
     */
    public function setBody($body)
    {
        $this->body = $body;
    
        return $this;
    }

    /**
     * Get body
     *
     * @return string 
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * Set category
     *
     * @param \Kendoctor\Bundle\NodeBundle\Entity\PageCategory $category
     * @return Page
     */
    public function setCategory(\Kendoctor\Bundle\NodeBundle\Entity\PageCategory $category = null)
    {
        $this->category = $category;
    
        return $this;
    }

    /**
     * Get category
     *
     * @return \Kendoctor\Bundle\NodeBundle\Entity\PageCategory 
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * Set slug
     *
     * @param string $slug
     * @return Page
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;
    
        return $this;
    }

    /**
     * Get slug
     *
     * @return string 
     */
    public function getSlug()
    {
        return $this->slug;
    }
}